import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';

interface MultiUserSelectProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  onLoadUsers?: () => Promise<User[]>;
  loading?: boolean;
}

export const MultiUserSelect: React.FC<MultiUserSelectProps> = ({
  selectedUsers,
  onUsersChange,
  placeholder = "Select users...",
  searchPlaceholder = "Search users...",
  disabled = false,
  className = "",
  onLoadUsers,
  loading = false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  // Load all users when dropdown opens
  useEffect(() => {
    const loadUsers = async () => {
      if (open && !usersLoaded && onLoadUsers) {
        setUsersLoading(true);
        try {
          const users = await onLoadUsers();

          const userArray = Array.isArray(users) ? users : [];
          setAllUsers(userArray);
          setFilteredUsers(userArray); // Initialize filtered users
          setUsersLoaded(true);
        } catch (error) {
          console.error('Error loading users:', error);
          setAllUsers([]);
          setFilteredUsers([]);
        } finally {
          setUsersLoading(false);
        }
      }
    };

    loadUsers();
  }, [open, usersLoaded, onLoadUsers]);

  // Filter users based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const searchLower = search.toLowerCase();
      const filtered = allUsers.filter(user => {
        const username = user.username?.toLowerCase() || '';
        const email = user.email?.toLowerCase() || '';
        const role = user.role?.toLowerCase().replace(/_/g, ' ') || '';
        const department = user.department?.toLowerCase() || '';

        return username.includes(searchLower) ||
               email.includes(searchLower) ||
               role.includes(searchLower) ||
               department.includes(searchLower);
      });
      setFilteredUsers(filtered);
    }
  }, [search, allUsers]);

  const handleSelect = (user: User) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      onUsersChange(selectedUsers.filter(u => u.id !== user.id));
    } else {
      onUsersChange([...selectedUsers, user]);
    }
  };

  const handleRemove = (userId: string) => {
    onUsersChange(selectedUsers.filter(u => u.id !== userId));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch('');
      // Reset filtered users to show all when reopened
      if (allUsers.length > 0) {
        setFilteredUsers(allUsers);
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">
                {user.username} ({user.role?.replace(/_/g, ' ')})
              </span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleRemove(user.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <Popover open={open && !loading} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading || disabled}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`
                  : placeholder
                }
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="max-h-60 overflow-auto">
            <div className="p-2">
              <Input
                placeholder={searchPlaceholder}
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {usersLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Loading users...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some(u => u.id === user.id);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(user)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">
                          {user.role?.replace(/_/g, ' ')} • {user.department}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && search && !usersLoading && usersLoaded && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No users found matching "{search}" (Total users: {allUsers.length})
                  </div>
                )}
                {filteredUsers.length === 0 && !search && !usersLoading && usersLoaded && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No users available (Loaded: {allUsers.length} users)
                  </div>
                )}
                {!usersLoaded && !usersLoading && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Click to load users...
                  </div>
                )}
                {filteredUsers.length > 0 && (
                  <div className="px-3 py-1 text-xs text-gray-400 border-b">
                    Showing {filteredUsers.length} of {allUsers.length} users
                  </div>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
