import path from 'path';
import fs from 'fs';
import readline from 'readline';
import stream from 'stream';
import folderPaths from '../config/paths.json';

export function getFiles() {
    const folder = path.resolve(__dirname, '../../', folderPaths.raw);
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            if (err) reject(err);
            resolve(
                files.filter(file => {
                    let extension = file.substring(file.indexOf('.'));
                    return extension === '.csv' || extension === '.txt';
                })
            );
        });
    });
}

export const toFormElm = arr => {
    return arr.map(elm => ({ label: elm, value: elm }));
};
