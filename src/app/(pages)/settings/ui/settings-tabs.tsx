import { ProfileCard } from './profile-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { ProfileEditForm } from '@features/edit-profile'
import { Role } from '@shared/prisma/generated/enums'
import { requireAuth } from '@shared/api/auth.guard'
import { AdminRoleManager } from '@features/update-role'

export async function SettingsTabs() {
  const user = await requireAuth()
  const isAdmin = user.role === Role.ADMIN

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileCard />
      </TabsContent>

      <TabsContent value="edit" className="mt-6">
        <ProfileEditForm />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="admin" className="mt-6">
          <AdminRoleManager />
        </TabsContent>
      )}
    </Tabs>
  )
}
