import fs from 'fs';
import mime from 'mime-types';

function blobToFile(theBlob, fileName) {
    fs.writeFileSync(fileName, theBlob, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("books.txt", "utf8"));
        }
    });

    console.log(theBlob);
}

export default blobToFile;