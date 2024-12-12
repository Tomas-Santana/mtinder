import {toast as sonner} from 'sonner-native';
import mt from '@/style/mtWind';
import { NormalToastContent } from '../app/NewChatToastContent';

export class Toast {
  static success(message: string) {
    sonner.custom(<NormalToastContent message={message} variant="success" />)
  }

  static error(message: string) {
    sonner.custom(<NormalToastContent message={message} variant="error" />)
  }

  static info(message: string) {
    sonner.custom(<NormalToastContent message={message} variant="info" />)
  }

  static warning(message: string) {
    sonner.warning(message);
  }

  static custom(jsx: React.ReactElement, id?: string) {
    sonner.custom(jsx, {
      id,
      duration: 3000,
    });
  }
}