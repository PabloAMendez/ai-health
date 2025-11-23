import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, FileWarning } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden group cursor-pointer
        border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
        ${isDragging 
          ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
          : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
        accept="image/*"
      />
      
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className={`
          p-4 rounded-full transition-colors duration-300
          ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-indigo-500 group-hover:text-white'}
        `}>
          <Upload size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-100">
            Sube tu imagen de prueba
          </h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Arrastra y suelta o haz clic para seleccionar. 
            <br/>
            Simularemos el input para tu archivo <span className="font-mono text-xs bg-slate-800 px-1 py-0.5 rounded">.h5</span>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(99,102,241,0.4)_0%,transparent_50%)]"></div>
      </div>
    </div>
  );
};

export default FileUpload;