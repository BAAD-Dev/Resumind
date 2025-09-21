"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';


const StateIcon = ({ state }: { state: 'uploading' | 'success' | 'error' | null }) => {
    if (state === 'uploading') {
        return (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        );
    }
    if (state === 'success') {
        return (
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        );
    }
     if (state === 'error') {
        return (
            <svg className="h-8 w-8 text-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        );
    }
    return null;
};


export default function AnalyzePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<'uploading' | 'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf");
        
        if (pdfFiles.length === 0 && acceptedFiles.length > 0) {
            alert("Hanya file PDF yang diperbolehkan.");
            return;
        }

        setFiles(pdfFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });
    
    const removeFile = () => {
        setFiles([]);
        setStatus(null);
        setErrorMessage('');
    };

    const handleAnalyze = async () => {
        if (files.length === 0) {
            alert("Silakan unggah CV terlebih dahulu.");
            return;
        }

        setStatus('uploading');
        setErrorMessage('');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const isSuccess = Math.random() < 0.8;

        if (isSuccess) {
            setStatus('success');
            console.log("Analisis berhasil, arahkan ke halaman hasil.");
        } else {
            setStatus('error');
            setErrorMessage("Terjadi kesalahan saat menganalisis CV. Silakan coba lagi.");
        }
    };


    return (
        <div className="bg-muted min-h-screen flex items-center justify-center font-sans">
            <div className="w-full max-w-2xl mx-auto p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground">Analyze Your CV with AI</h1>
                    <p className="text-slate-600 mt-2">
                        Get instant feedback to improve your resume and match with the right jobs.
                    </p>
                </div>

                <div className="bg-background rounded-2xl shadow-xl p-8">
                    <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}
                    >
                        <input {...getInputProps()} />
                        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        {isDragActive ? (
                            <p className="mt-2 text-primary">Drop the file here ...</p>
                        ) : (
                            <p className="mt-2 text-slate-600">Drag & drop your CV here, or click to select file</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">PDF only, max 5MB</p>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-foreground">Uploaded File:</h3>
                            <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <StateIcon state={status} />
                                    <p className="text-foreground font-medium">{files[0].name}</p>
                                </div>
                                <button onClick={removeFile} className="p-1 rounded-full hover:bg-slate-200">
                                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            {status === 'error' && <p className="text-sm text-danger mt-2">{errorMessage}</p>}
                        </div>
                    )}
                    
                    <div className="mt-8">
                        <button
                            onClick={handleAnalyze}
                            disabled={files.length === 0 || status === 'uploading'}
                            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                           {status === 'uploading' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                           {status === 'uploading' ? 'Analyzing...' : 'Analyze My CV'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

