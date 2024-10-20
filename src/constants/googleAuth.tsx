import * as request from '../utils/request';

// Định nghĩa kiểu trả về của hàm là `Promise<string | undefined>` để chỉ ra rằng hàm này trả về một chuỗi hoặc `undefined`.
export const getClientId = async (): Promise<string | undefined> => {
  let clientId: string | undefined;
  try {
    const response = await request.get("Auth/google-client-id");
    clientId = response.clientId;
  } catch (error) {
    console.log(error);
    return undefined;
  }

  return clientId;
};
