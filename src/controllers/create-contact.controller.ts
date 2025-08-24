import { PrismaService } from 'src/prisma/prisma.service';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { type UserPayload } from 'src/auth/jwt.strategy'
import z from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const createContactBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  photo: z.string(),
  reference: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createContactBodySchema)

type CreateContactBodySchema = z.infer<typeof createContactBodySchema>
@Controller('/contacts')
@UseGuards(JwtAuthGuard)
export class CreateContactController {
  constructor(private prisma:PrismaService) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateContactBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, phone, photo, reference } = body
    const userId = user.sub
    await this.prisma.contact.create({
      data: {
        name,
        email,
        phone,
        photo,
        reference,
        userId
      }
    })  

    return 'Contato criado com sucesso!'
  }
}