import {toast as sonner} from 'sonner-native';
import mt from '@/style/mtWind';

export class Toast {
  static success(message: string) {
    sonner.success(message, {
      style: mt.glow("md", "green"),
    });
  }

  static error(message: string) {
    sonner.error(message, {
      style: mt.glow("md", "red"),
    });
  }

  static info(message: string) {
    sonner.info(message, {
      style: mt.glow("md", "blue"),
    });
  }

  static warning(message: string) {
    sonner.warning(message, {
      style: mt.glow("md", "orange"),
    });
  }

  static custom(jsx: React.ReactElement, id?: string) {
    sonner.custom(jsx, {
      id,
    });
  }
}