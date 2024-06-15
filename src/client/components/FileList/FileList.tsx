import axios from "axios";
import React, { useEffect, useState } from "react";

import { FILES_ENDPOINT, FILE_ENDPOINT } from "../../utils/Endpoints";

import './FileList.css';
import { IFileBlob } from "@src/client/utils/Types";

const FileList = () => {
    const decoder = new TextDecoder();
    const [fileList, setFileList] = useState(['']);
    useEffect(() => {
        const getFiles = async () => {
            try {
                const response = await axios.get(FILES_ENDPOINT);
                setFileList(response.data.fileNames);
            } catch (error) {
                console.error('Could not get files', error);
            }
        }

        getFiles();
    }, []);

    const getFile = async (fileName: string) => {
        try {
            const response = await axios.get(FILE_ENDPOINT, {
                responseType: 'arraybuffer',
                params: {
                    fileName
                }
            });

            const decodedData = decoder.decode(response.data);
            const parsedData = JSON.parse(decodedData);
            const decodedText = (parsedData as IFileBlob).blobData;

            /** Using .innerText forces a reflow whereas textContent does not */
            document.getElementById('passage')!.textContent = decodedText;
        } catch (error) {
            console.error('Could not get file', error);
        }
    }

    return (
        <>
            {fileList.length > 0 && 
                (<ul>
                    {fileList.map(fileName => <li onClick={()=> getFile(fileName)}>{fileName}</li>)}
                </ul>)
            }
        </>
    )
}

export default FileList;