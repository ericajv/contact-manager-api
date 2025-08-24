import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { type UserPayload } from 'src/auth/jwt.strategy'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadFileController {
  @Post('')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // pasta onde vai salvar
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname); // pega extensão (.png, .jpg, etc)
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(
    @Request() request,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserPayload,
  ) {
    return {
      filename: file.filename,
      path: `${request.protocol}://${request.get('host')}/${file.path}`,
      uploadeBy: user.sub,
    };
  }
}
