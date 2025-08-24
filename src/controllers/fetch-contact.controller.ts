import { PrismaService } from 'src/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { type UserPayload } from 'src/auth/jwt.strategy'
import z from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const fetchContactQuerySchema = z.object({
  search: z.string().optional(),
})

const quyeryValidationPipe = new ZodValidationPipe(fetchContactQuerySchema)

type FetchContactQuerySchema = z.infer<typeof fetchContactQuerySchema>

@Controller('/contacts')
@UseGuards(JwtAuthGuard)
export class FetchContactController {
  constructor(private prisma:PrismaService) { }

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(quyeryValidationPipe) query: FetchContactQuerySchema
  ) {
    const { search } = query
    const contacts = await this.prisma.contact.findMany({
      where: {
        userId: user.sub,
        name: search ? { startsWith: search, mode: 'insensitive' } 
        : undefined
      }
    })  

    return {contacts}
  }
}