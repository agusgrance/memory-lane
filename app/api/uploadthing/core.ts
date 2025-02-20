import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();
export const utapi = new UTApi();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ file }) => {
            return { url: file.url, key: file.key };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 