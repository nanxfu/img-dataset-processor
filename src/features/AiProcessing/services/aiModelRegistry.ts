import * as ort from 'onnxruntime-web/webgpu';

// 会话缓存，按 key 管理不同模型实例
const sessions: Record<string, ort.InferenceSession> = {};

/**
 * 加载并缓存 ONNX 模型
 * @param key 模型标识符
 * @param modelUrl 模型文件 URL
 */
export async function loadModel(key: string, modelUrl: string): Promise<ort.InferenceSession> {
  if (sessions[key]) {
    return sessions[key];
  }
  // 创建 InferenceSession，默认使用 wasm 后端
  const session = await ort.InferenceSession.create(modelUrl, {
    executionProviders: ['webgpu'],
  });
  sessions[key] = session;
  return session;
}

/**
 * 获取已加载的模型实例
 */
export function getModel(key: string): ort.InferenceSession | undefined {
  return sessions[key];
}

/**
 * 检查模型是否已加载
 */
export function hasModel(key: string): boolean {
  return !!sessions[key];
}
