import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

interface MediaAssetsData {
  video?: File[];
  slides?: File[];
  pictures?: File[];
  [key: string]: File[] | undefined;
}

interface MediaAssetsUploadProps {
  value?: MediaAssetsData;
  onChange?: (value: MediaAssetsData) => void;
}

const MediaAssetsUpload: React.FC<MediaAssetsUploadProps> = ({ value = {}, onChange }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onChange?.({ ...value, [type]: fileArray });
    }
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    handleFileUpload(type, files);
  };

  const uploadAreas = [
    {
      key: "video",
      src: "/images/video.gif",
      title: "Video File",
      description: "Select and upload a video file (MP4, MOV). Max size: 500 MB.",
      acceptedTypes: ".mp4,.mov",
      maxSize: "500 MB",
      multiple: false,
    },
    {
      key: "slides",
      src: "/images/slide.gif",
      title: "Slides File",
      description: "Upload presentation slides (PDF, PPTX). Max size: 20 MB",
      acceptedTypes: ".pdf,.pptx",
      maxSize: "20 MB",
      multiple: false,
    },
    {
      key: "pictures",
      src: "/images/photo-gallery.gif",
      title: "Pictures File",
      description: "Choose image files (JPG, PNG). You can upload multiple. Max size per file: 10 MB",
      acceptedTypes: ".jpg,.jpeg,.png",
      maxSize: "10 MB",
      multiple: true,
    },
  ];

  return (
    <div className='mb-6 w-full'>
      <h3 className='mb-4 text-base font-medium text-text-muted'>Media Assets Upload</h3>

      {/* Horizontal Carousel */}
      <div className='overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div className='flex min-w-max space-x-6'>
          {uploadAreas.map((area) => {
            const isDragOver = dragOver === area.key;
            const hasFiles = value[area.key] && value[area.key]!.length > 0;

            return (
              <div
                key={area.key}
                className={`w-[344px] flex-shrink-0 rounded-2xl border border-text-muted/10 bg-white p-6 shadow-lg ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${hasFiles ? "border-green-500 bg-green-50" : ""} transition-colors`}
                onDragOver={(e) => handleDragOver(e, area.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, area.key)}
              >
                <div className='text-center'>
                  <div className='mb-4 flex justify-center'>
                    <Image src={area.src} alt={area.title} width={50} height={50} />
                  </div>

                  <h4 className='mb-4 text-base font-medium text-primary'>{area.title}</h4>

                  <p className='mb-8 text-sm leading-relaxed text-[#898989]'>{area.description}</p>

                  {hasFiles && value[area.key] && (
                    <div className='mb-4 rounded bg-green-100 p-2'>
                      <p className='text-sm text-green-800'>
                        {value[area.key]!.length} file{value[area.key]!.length !== 1 ? "s" : ""} uploaded
                      </p>
                    </div>
                  )}

                  <div className='relative'>
                    <input
                      type='file'
                      accept={area.acceptedTypes}
                      multiple={area.multiple}
                      onChange={(e) => handleFileUpload(area.key, e.target.files)}
                      className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      className='h-[43px] w-full rounded-md border-none bg-[#F5F5F5] font-medium text-text-muted hover:bg-gray-50'
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaAssetsUpload;
