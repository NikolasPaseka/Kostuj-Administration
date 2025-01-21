import React, { useCallback } from 'react'
import { UserData } from '../../model/UserData'
import { UiState } from '../../communication/UiState'
import GenericTable from './GenericTable'
import { Tooltip, User } from "@heroui/react"
import { PencilIcon } from '@heroicons/react/16/solid'
import { AuthorizationRoles, authorizationRolesArray } from '../../model/AuthorizationRoles'
import { ModalProps } from '../Modals/ModalProps'
import GenericChip from '../Controls/GenericChip'
import { getNestedValue } from './getNestedValues'

type Props = {
  users: UserData[]
  uiState: UiState,
  editModalProps? : ModalProps
  onUserEditSelected?: (user: UserData) => void
}

const UsersTable = ({ users, uiState, editModalProps, onUserEditSelected }: Props) => {

  const tableColumns = [
    { name: "Name", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Created at", uid: "createdAt" },
    { name: "Authorizations", uid: "authorizations" },
    { name: "Actions", uid: "actions" }
  ]

  const renderCell = useCallback((user: UserData, columnKey: React.Key) => {
    const cellValue = getNestedValue(user, columnKey as string);

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: user.avatarImageUrl}}
            description={""}
            name={user.firstName + " " + user.lastName}
          />
        );
      case "createdAt":
        return new Date(user.createdAt).toLocaleDateString();
      case "authorizations":
        return (
          <div className="flex flex-wrap gap-2">
            {authorizationRolesArray.map((auth) => 
            user.authorizations.includes(auth.value) && (
              <GenericChip> {auth.label} </GenericChip>
            ))}
          </div>
        )
      case "actions":
        return (
          <>{!user.authorizations.includes(AuthorizationRoles.SUPER_ADMIN) && 
            <div className="flex items-center gap-2">
              <span
                onClick={() => { 
                  editModalProps?.onOpen && editModalProps.onOpen()
                  onUserEditSelected && onUserEditSelected(user)
                }}
                className="cursor-pointer">
                <Tooltip content="Edit">
                    <PencilIcon className='w-5 h-5 text-gray-600' />
                </Tooltip>
              </span>
            </div>
            }
          </>
        );
      default:
        return cellValue;
    }
  }, [editModalProps, onUserEditSelected]);

  return (
    <GenericTable 
      tableColumns={tableColumns}
      data={users}
      uiState={uiState}
      renderCell={renderCell}
    />
  )
}

export default UsersTable