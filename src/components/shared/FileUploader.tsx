import { convertFileToUrl } from '@/lib/utils';
import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone';

type props = {
    fieldChange: (files: File[]) => void,
    mediaUrl: string | undefined
}

const FileUploader = ({ fieldChange, mediaUrl }: props) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string | undefined>(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(convertFileToUrl(acceptedFiles[0]));
        },
        [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        },
    });

    return (
        <div className='flex-center'>
            <div {...getRootProps()} className='w-fit'>
                <input {...getInputProps()} />

                <div className='flex flex-col flex-center cursor-pointer'>{
                    fileUrl ?
                        <img src={fileUrl} alt='uploadedFile' className='h-40 rounded-lg' /> :
                        <>
                            <img src='/assets/icons/file-upload.svg' alt='uploadFile' className='h-40' />
                            <h3 className='h3-bold mt-1'>Click or drag a file</h3>
                            <h3 className='tiny-medium text-light-4'>SVG, PNG, JPG</h3>
                        </>
                }
                </div>

            </div>
        </div>
    )
}

export default FileUploader