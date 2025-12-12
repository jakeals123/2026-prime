import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateReminderMessage = async (
  renterName: string,
  itemName: string,
  returnDate: string,
  isOverdue: boolean
): Promise<string> => {
  try {
    const today = new Date().toLocaleDateString('ko-KR');
    const formattedReturnDate = new Date(returnDate).toLocaleDateString('ko-KR');
    
    let prompt = `대여자 이름: ${renterName}, 대여 물품: "${itemName}", 반납 예정일: ${formattedReturnDate}, 오늘 날짜: ${today}.
    이 정보를 바탕으로 대여자에게 보낼 정중하고 전문적인 짧은 알림 메시지(한국어, 공백 포함 150자 이내)를 작성해주세요.`;

    if (isOverdue) {
      prompt += ` 현재 반납 기한이 지났습니다(연체). 즉시 반납해달라는 내용을 단호하지만 정중하게 포함해주세요.`;
    } else {
      prompt += ` 반납일이 다가오고 있음을 친절하게 알려주는 리마인더 메시지로 작성해주세요.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "메시지를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Error generating reminder:", error);
    return `${renterName}님, 대여하신 ${itemName}의 반납일은 ${new Date(returnDate).toLocaleDateString('ko-KR')}입니다. 반납 부탁드립니다.`;
  }
};