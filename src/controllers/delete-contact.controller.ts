import { PrismaService } from 'src/prisma/prisma.service';
import { Controller, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { type UserPayload } from 'src/auth/jwt.strategy'



@Controller('/contacts')
@UseGuards(JwtAuthGuard)
export class DeleteContactController {
  constructor(private prisma: PrismaService) { }

  @Delete('/:id')
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const contact = await this.prisma.contact.findFirst({
      where: { id }
    })
    if (!contact) {
      throw new Error('Contato não encontrado')
    }
     await this.prisma.contact.delete({
      where: { id },
    })

    return { message: "Contato deletado com sucesso" }
  }
}