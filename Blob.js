const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
const fs = require("fs");

async function main() {
    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");

        const AZURE_STORAGE_CONNECTION_STRING =
            process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw Error('Azure Storage Connection string not found');
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(
            AZURE_STORAGE_CONNECTION_STRING
        );

        //// Code to upload values to blob (Container)
        // const containerClient = blobServiceClient.getContainerClient("images");
        // const blobName = 'dd' + '.mp4'; // Name your image blob
        // // Path to the image file you want to upload
        // const imagePath = 'C:/Users/nawaf/Desktop/blob/50.mp4'; // Replace with the path to your image file
        // // Open the image file
        // const imageFileStream = fs.createReadStream(imagePath);
        // // Get a block blob client
        // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // // Display blob name and URL
        // console.log(
        //     `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
        // );
        // // Upload image data to the blob
        // const uploadBlobResponse = await blockBlobClient.uploadStream(imageFileStream);
        // console.log(
        //     `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        // );




        // Code to retrieve elements from Blob with continuationToken
        // Retrieving container client
        const containerClient = blobServiceClient.getContainerClient("images");

        // Defining maximum page size for listing blobs
        const maxPageSize = 20;

        // Initializing counter
        let i = 1;

        // Options for listing blobs
        const listOptions = {
            includeMetadata: false,
            includeSnapshots: false,
            includeTags: false,
            includeVersions: false,
            prefix: ''
        };

        // Iterating over blobs by page
        let iterator = containerClient.listBlobsFlat(listOptions).byPage({ maxPageSize });
        let response = (await iterator.next()).value;

        // Printing blob names
        for (const blob of response.segment.blobItems) {
            //Get Blob Client from name, to get the URL
            const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
            //Display blob name, URL and continuationToken
            console.log(blob.name)
            console.log(response.continuationToken)
            console.log(`Flat listing: ${i++}: ${tempBlockBlobClient.url}`);
        }

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

main()
    .then(() => console.log("Done"))
    .catch((ex) => console.log(ex.message));
