import path from 'path';
import fs from 'fs';
import readline from 'readline';
import stream from 'stream';

export function getFilteredCSVS() {
    const folder = path.resolve(__dirname, '../../', 'public/filtered_csv');
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    });
}

export const toFormElm = arr => {
    return arr.map(elm => ({ label: elm, value: elm }));
};
