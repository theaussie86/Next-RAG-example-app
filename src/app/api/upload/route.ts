import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import pdf from "pdf-parse";

import { getEmbeddingsTransformer, searchArgs } from "@/utils/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { CharacterTextSplitter } from "langchain/text_splitter";
import path from "path";
import { client, collectionName, dbName } from "@/utils/db";
import { get } from "http";

export async function POST(req: NextRequest) {
  try {
    // Check Bearer Token
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (token !== process.env.UPLOAD_API_KEY) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Download the file
    const fileToDownload =
      "https://docs.google.com/document/d/1ybGyvHxuJP4mBPh9NHnB9-kWMUIB9KLnMwgk9aSuUYw/export?format=pdf";

    const response = await fetch(fileToDownload, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    const blob = await response.blob();

    // Get the file name
    const contentMeta = response.headers.get("content-disposition")?.split(";");
    const fileName = contentMeta
      ?.find((c) => c.includes("filename="))
      ?.split("=")[1]
      .replace(/"/g, "");
    const tempFileName = fileName ?? "temp.pdf";
    const tempFilePath = path.join(process.cwd(), tempFileName);

    const currentFileName = await getCurrentFileName();

    if (tempFileName === currentFileName) {
      return NextResponse.json(
        { message: "Already uploaded" },
        { status: 200 }
      );
    }

    // Set the current file name in the database
    await setCurrentFileName(tempFileName);

    // Delete old embeddings
    await deleteOldEmbeddings();

    // Save the file temporarily
    const fileBuffer = Buffer.from(await blob.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Read file content and extract text
    const dataBuffer = await fs.readFile(tempFilePath);

    await pdf(await dataBuffer).then(async function (data: { text: any }) {
      // Spread data into chunks
      const chunks = await new CharacterTextSplitter({
        separator: "\n",
        chunkSize: 1000,
        chunkOverlap: 100,
      }).splitText(data.text);
      console.log(chunks.length);

      // Convert chunks to Vectors and store into MongoDB
      await MongoDBAtlasVectorSearch.fromTexts(
        chunks,
        [],
        getEmbeddingsTransformer(),
        searchArgs()
      );

      // Remove the temporary file
      await fs.unlink(tempFilePath);
    });

    return NextResponse.json(
      { message: "Uploaded to MongoDB" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    // Handle the error accordingly, for example, return an error response.
    return new NextResponse("An error occurred during processing.", {
      status: 500,
    });
  }
}

async function deleteOldEmbeddings() {
  await client.db(dbName).collection(collectionName).deleteMany({});
}

async function getCurrentFileName() {
  const config = await client.db(dbName).collection("config").findOne({});
  return config?.fileName;
}

async function setCurrentFileName(fileName: string) {
  await client.db(dbName).collection("config").updateOne(
    {},
    {
      $set: {
        fileName,
      },
    },
    { upsert: true }
  );
}
