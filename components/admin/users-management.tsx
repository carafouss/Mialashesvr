"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, Loader2 } from "lucide-react"
import { getAdminUsers, createAdminUser, deleteAdminUser, type AdminUser } from "@/lib/supabase/data-service"

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    loadUsers()
    const storedUser = localStorage.getItem("mia_current_user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getAdminUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError("")

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    if (users.some((u) => u.username === formData.username)) {
      setError("Ce nom d'utilisateur existe déjà")
      return
    }

    setSaving(true)
    try {
      await createAdminUser({
        username: formData.username,
        password: formData.password,
        role: "admin",
        created_by: currentUser?.id,
      })
      await loadUsers()
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error("Error creating user:", error)
      setError("Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
    })
    setError("")
  }

  const handleDelete = async (id: string, username: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`)) {
      try {
        await deleteAdminUser(id)
        await loadUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Erreur lors de la suppression")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Créez et gérez les comptes administrateurs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
              <DialogDescription>Ajoutez un nouvel administrateur pour accéder au système</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="ex: marie.dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Retapez le mot de passe"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-blue-900 mb-1">Permissions de l'utilisateur :</p>
                <ul className="text-blue-700 space-y-1 ml-4 list-disc">
                  <li>Accès à toutes les fonctions administratives</li>
                  <li>
                    <strong>Ne peut pas</strong> supprimer des ventes
                  </li>
                  <li>
                    <strong>Ne peut pas</strong> gérer d'autres utilisateurs
                  </li>
                </ul>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : "Créer l'utilisateur"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.role === "super_admin" ? (
                        <Shield className="h-4 w-4 text-amber-500" />
                      ) : (
                        <div className="h-4 w-4 text-blue-500"></div>
                      )}
                      {user.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "super_admin" ? (
                      <Badge variant="default" className="bg-amber-500">
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Administrateur</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Actif
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.role !== "super_admin" && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, user.username)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Hiérarchie des permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-amber-900">Super Administrateur</span>
            </div>
            <ul className="ml-7 space-y-1 text-amber-800">
              <li>Accès complet à toutes les fonctions</li>
              <li>Peut créer et supprimer des utilisateurs</li>
              <li>Peut supprimer des ventes</li>
              <li>Gestion totale du système</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 text-blue-500"></div>
              <span className="font-semibold text-blue-900">Administrateur</span>
            </div>
            <ul className="ml-7 space-y-1 text-blue-800">
              <li>Peut enregistrer des ventes</li>
              <li>Peut gérer produits, catégories, promotions</li>
              <li>Peut générer des rapports</li>
              <li>Ne peut pas supprimer de ventes</li>
              <li>Ne peut pas gérer d'autres utilisateurs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
