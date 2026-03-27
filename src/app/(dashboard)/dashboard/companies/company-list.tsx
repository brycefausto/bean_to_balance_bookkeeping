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
import { Company } from "@prisma/client";
import { IconDots, IconEdit, IconLoader, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { CreateCompanyDialog } from "./create-company-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditCompanyDialog } from "./edit-user-dialog";

// // User type definition based on the schema
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean | null;
//   role: "USER" | "ADMIN";
//   createdAt: string;
// };

export default function CompanyList({
  companies,
  totalPages,
}: {
  companies: Company[];
  totalPages: number;
}) {
  const authUser = getUserFromSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit user state
  const [editingUser, setEditingUser] = useState<Company | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<Company | null>(null);
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
  const handleEditUser = (user: Company) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: Company) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Manage companies
          </p>
        </div>
        <div className="flex gap-2">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
            onClick={handleSearchClick}
          />
          <CreateCompanyDialog />
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
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No users found. Create your first user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      {company.email}
                      {company.id == authUser.id && (
                        <Badge variant="outline" className="ml-2">
                          Current User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {company.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {company.address}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {toDateString(company.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {authUser.id != company.id && (
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
                              onClick={() => handleEditUser(company)}
                            >
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(company)}
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
        <EditCompanyDialog
          company={editingUser}
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
