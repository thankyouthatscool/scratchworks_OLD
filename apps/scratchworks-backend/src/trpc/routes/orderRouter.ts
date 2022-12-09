import AWS from "aws-sdk";
import { z } from "zod";

import { publicProcedure, router } from "..";

const imageUploadInput = z.object({
  imageName: z.string(),
});

const analyzeImageInput = z.object({ imageName: z.string() });

const uploadOrderImage = publicProcedure
  .input(imageUploadInput)
  .mutation(async ({ input: { imageName } }) => {
    const s3 = new AWS.S3({
      signatureVersion: "v4",
    });

    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: "grace-test-orders",
      Key: `${imageName}.jpg`,
      Expires: 60 * 5,
    });

    return signedUrl;
  });

const analyzeImage = publicProcedure
  .input(analyzeImageInput)
  .mutation(async ({ input: { imageName } }) => {
    const textract = new AWS.Textract({
      signatureVersion: "v4",
      region: "us-east-1",
    });

    const getTextData = (imageName: string) => {
      return new Promise<AWS.Textract.BlockList>((resolve, reject) => {
        textract.analyzeDocument(
          {
            Document: {
              S3Object: {
                Bucket: "grace-test-orders",
                Name: `${imageName}.jpg`,
              },
            },
            FeatureTypes: ["TABLES"],
          },
          (err, data) => {
            if (err) {
              reject(new Error("Could not extract text."));
            } else {
              resolve(data.Blocks!);
            }
          }
        );
      });
    };

    try {
      const textBlocks = await getTextData(imageName);

      return textBlocks;
    } catch {
      throw new Error("Could not extract text.");
    }
  });

export const orderRouter = router({ analyzeImage, uploadOrderImage });
