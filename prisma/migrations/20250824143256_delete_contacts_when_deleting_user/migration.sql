-- DropForeignKey
ALTER TABLE "public"."contacts" DROP CONSTRAINT "contacts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
