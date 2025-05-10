import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 임시 간단 텍스트 에디터 컴포넌트
 * React-Quill이 React 18과 호환성 문제가 있어서 임시로 사용
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const handleImageUpload = async (blobInfo: any, progress: any) => {
    try {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      console.log('업로드 응답:', data);
      
      // API 응답에서 url 필드 사용 (TinyMCE 표준)
      return data.url;
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw error; // 전체 오류 객체 반환하여 TinyMCE에서 처리
    }
  };

  return (
    <Editor
      apiKey="i9u0xro7dpt1f3d69shwf0lt68tgrbrt0y2l589zoynivamm"
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 500,
        menubar: true,
        language: 'ko_KR',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | ' +
          'bold italic forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'image media table | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        images_reuse_filename: true,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false, // URL 자동 변환 방지
        font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
        font_family_formats: '나눔고딕=Nanum Gothic, 나눔명조=Nanum Myeongjo, 맑은 고딕=Malgun Gothic, 굴림=Gulim, 돋움=Dotum, 바탕=Batang, 궁서=Gungsuh, Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'
      }}
    />
  );
};

export default RichTextEditor; 