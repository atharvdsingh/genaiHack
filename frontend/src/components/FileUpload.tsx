import { useState, useRef, useReducer } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import axios from "axios"
import { log } from 'console';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setQuizData } from '../store/quizSlice';
import { useSelector } from 'react-redux';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
const dispatch = useAppDispatch();
const quiz = useAppSelector((state) => state.quiz.quizData);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (PNG, JPEG, JPG)');
      return;
    }
    setSelectedFile(file);
  };
  const handleUploadClick =async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
      formData.append("file", selectedFile);
        
         const body=await axios.post("http://localhost:5000/analyze",formData)
         dispatch(setQuizData(body.data.a));  // <-- store quiz


         console.log(quiz.quiqe)
        console.log()
        
      } catch (error) {
        
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-16 h-16 text-gray-400" />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FileText className="w-16 h-16 text-red-500" />;
    }
    return <Image className="w-16 h-16 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Upload Your Document</CardTitle>
        <CardDescription>Upload a PDF or image to generate your quiz</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleChange}
            id="file-upload"
          />

          <div className="flex flex-col items-center gap-4">
            {getFileIcon()}

            {selectedFile ? (
              <div className="space-y-2">
                <Label className="text-gray-800">{selectedFile.name}</Label>
                <p className="text-gray-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Remove file
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">Drag and drop your file here, or</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBrowseClick}
                  className="text-blue-600"
                >
                  browse files
                </Button>
                <p className="text-gray-500 text-sm">Supported formats: PDF, PNG, JPEG, JPG</p>
              </div>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleUploadClick}
              size="lg"
              className="shadow-lg"
            >
              Analyze Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}