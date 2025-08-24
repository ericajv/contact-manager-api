import { PrismaService } from 'src/prisma/prisma.service';
import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { type UserPayload } from 'src/auth/jwt.strategy'
import z from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const updateContactBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  photo: z.string(),
  reference: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(updateContactBodySchema)

type UpdateContactBodySchema = z.infer<typeof updateContactBodySchema>
@Controller('/contacts')
@UseGuards(JwtAuthGuard)
export class UpdateContactController {
  constructor(private prisma: PrismaService) { }

  @Put('/:id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateContactBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, phone, photo, reference } = body
    const userId = user.sub
    const contact = await this.prisma.contact.findFirst({
      where: { id }
    })
    if (!contact) {
      throw new Error('Contato não encontrado')
    }
    const update = await this.prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        photo,
        reference,
        userId
      }
    })

    return { message: "Contato atualizado com sucesso", contact: update };
  }
}