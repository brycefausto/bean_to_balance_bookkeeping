"use client";

import { getUserFromSession } from "@/auth-client";
import { AppPagination } from "@/components/app-pagination";
import SearchInput from "@/components/inputs/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usePageUtils from "@/hooks/use-page-utils";
import { toDateString } from "@/lib/date.utils";
import { User } from "@prisma/client";
import { IconDots, IconEdit, IconLoader, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { CreateUserDialog } from "./create-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";

// // User type definition based on the schema
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean | null;
//   role: "USER" | "ADMIN";
//   createdAt: string;
// };

export default function UserList({
  users,
  totalPages,
}: {
  users: User[];
  totalPages: number;
}) {
  const authUser = getUserFromSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit user state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    page,
    searchValue,
    changePage,
    handleSearchClick,
    handleSearchChange,
    handleSearchEnter,
  } = usePageUtils();

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
            onClick={handleSearchClick}
          />
          <CreateUserDialog />
        </div>
      </div>

      <Separator />

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <IconLoader className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="rounded-md border bg-card p-4 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Verified</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No users found. Create your first user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      {user.email}
                      {user.id == authUser.id && (
                        <Badge variant="outline" className="ml-2">
                          Current User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.emailVerified ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {toDateString(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {authUser.id != user.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconDots className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                            >
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <AppPagination
            initialPage={page}
            total={totalPages}
            onChangePage={changePage}
          />
        </div>
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      {/* Delete User Dialog */}
      {deletingUser && (
        <DeleteUserDialog
          userId={deletingUser.id}
          userName={deletingUser.name}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </div>
  );
}
