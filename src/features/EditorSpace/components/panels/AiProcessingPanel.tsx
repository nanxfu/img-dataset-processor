import { Tensor } from 'onnxruntime-web';
import { useState } from 'react';
import { styled } from 'styled-components';

import ActionButton from '../../../../components/ActionButton';
import { useEditorStore } from '../../../../store/useEditorStore';
import { loadModel } from '../../../AiProcessing/services/aiModelRegistry';
import { imageToTensor, upscaleImageWithPatches } from '../../../AiProcessing/services/imageHelper';

const PanelSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const InfoText = styled.div`
  color: #666;
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 16px;
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProcessingStatus = styled.div<{ $isProcessing: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${props => (props.$isProcessing ? '#f0f9ff' : '#f9fafb')};
  border: 1px solid ${props => (props.$isProcessing ? '#1890ff' : '#e0e0e0')};
  color: ${props => (props.$isProcessing ? '#1890ff' : '#666')};
  font-size: 12px;
  text-align: center;
  margin-bottom: 12px;
`;

const ResultDisplay = styled.div`
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 12px;
`;

// Softmax函数用于AI分类结果处理
function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exp = arr.map(value => Math.exp(value - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(value => value / sum);
}

const AiProcessingPanel: React.FC = () => {
  const selectedImage = useEditorStore(state => state.selectedImage);
  const currentTool = useEditorStore(state => state.currentTool);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [classificationResult, setClassificationResult] = useState<string>('');

  const handleAiClassification = async () => {
    if (!selectedImage?.file) return;

    setIsProcessing(true);
    setProcessingStatus('正在加载AI分类模型...');

    try {
      // 加载模型
      const model = await loadModel('imageClassification', '/models/squeezenet1.1-7.onnx');
      if (!model) {
        throw new Error('模型加载失败');
      }

      setProcessingStatus('正在分析图片...');

      // 使用模型进行推理
      const inputTensor = await imageToTensor(selectedImage.file);
      const feeds: Record<string, Tensor> = {};
      feeds[model.inputNames[0]] = inputTensor;
      const outputData = await model.run(feeds);
      const output = outputData[model.outputNames[0]];

      // 获取 softmax 结果
      const outputSoftmax = softmax(Array.prototype.slice.call(output.data));
      const maxIndex = outputSoftmax.indexOf(Math.max(...outputSoftmax));
      const confidence = (outputSoftmax[maxIndex] * 100).toFixed(2);

      setClassificationResult(`分类结果: 类别 ${maxIndex + 1} (置信度: ${confidence}%)`);
      setProcessingStatus('分类完成');
    } catch (error) {
      console.error('AI分类失败:', error);
      setProcessingStatus('分类失败，请重试');
      setClassificationResult('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAiUpscale = async () => {
    if (!selectedImage?.file) return;

    setIsProcessing(true);
    setProcessingStatus('正在准备AI放大模型...');

    try {
      setProcessingStatus('正在处理图片，请稍候...');

      const upscaledImage = await upscaleImageWithPatches(selectedImage.file, loadModel);
      const canvas = document.createElement('canvas');

      canvas.width = upscaledImage.width;
      canvas.height = upscaledImage.height;

      const img = await createImageBitmap(upscaledImage);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }

      ctx.drawImage(img, 0, 0, upscaledImage.width, upscaledImage.height);

      // 下载放大后的图片
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/jpeg');
      a.download = `upscaled_${selectedImage.name}`;
      a.click();

      setProcessingStatus('AI放大完成');
    } catch (error) {
      console.error('AI放大失败:', error);
      setProcessingStatus('AI放大失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAiRepair = async () => {
    setIsProcessing(true);
    setProcessingStatus('高清修复功能开发中...');

    // 模拟处理时间
    setTimeout(() => {
      setProcessingStatus('此功能即将推出');
      setIsProcessing(false);
    }, 2000);
  };

  const renderToolContent = () => {
    switch (currentTool) {
      case 'ai-classify':
        return (
          <PanelSection>
            <SectionTitle>AI 图片分类</SectionTitle>
            <InfoText>使用深度学习模型自动识别图片内容类别，帮助您快速整理和标记图片。</InfoText>
            {isProcessing && (
              <ProcessingStatus $isProcessing={true}>{processingStatus}</ProcessingStatus>
            )}
            <ActionGroup>
              <ActionButton onClick={handleAiClassification} disabled={isProcessing}>
                {isProcessing ? '处理中...' : '开始分类'}
              </ActionButton>
            </ActionGroup>
            {classificationResult && <ResultDisplay>{classificationResult}</ResultDisplay>}
          </PanelSection>
        );

      case 'ai-upscale':
        return (
          <PanelSection>
            <SectionTitle>AI 图片放大</SectionTitle>
            <InfoText>
              使用超分辨率算法将图片放大4倍，同时保持图片清晰度和细节。适合提升低分辨率图片质量。
            </InfoText>
            {isProcessing && (
              <ProcessingStatus $isProcessing={true}>{processingStatus}</ProcessingStatus>
            )}
            <ActionGroup>
              <ActionButton onClick={handleAiUpscale} disabled={isProcessing}>
                {isProcessing ? '处理中...' : '4倍放大'}
              </ActionButton>
            </ActionGroup>
          </PanelSection>
        );

      case 'ai-repair':
        return (
          <PanelSection>
            <SectionTitle>高清修复</SectionTitle>
            <InfoText>智能修复图片中的噪点、模糊和压缩伪影，提升图片整体质量。</InfoText>
            {isProcessing && (
              <ProcessingStatus $isProcessing={true}>{processingStatus}</ProcessingStatus>
            )}
            <ActionGroup>
              <ActionButton onClick={handleAiRepair} disabled={isProcessing}>
                {isProcessing ? '处理中...' : '开始修复'}
              </ActionButton>
            </ActionGroup>
          </PanelSection>
        );

      default:
        return (
          <PanelSection>
            <InfoText>请从左侧工具栏选择AI处理功能</InfoText>
          </PanelSection>
        );
    }
  };

  return <>{renderToolContent()}</>;
};

export default AiProcessingPanel;
