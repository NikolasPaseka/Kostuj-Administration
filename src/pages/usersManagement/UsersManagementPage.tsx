import { useEffect, useState } from 'react'
import { UserRepository } from '../../communication/repositories/UserRepository'
import { isSuccess } from '../../communication/CommunicationsResult'
import { UserData } from '../../model/UserData'
import UsersTable from '../../components/Tables/UsersTable'
import { UiState, UiStateType } from '../../communication/UiState'
import ModalDialog from '../../components/ModalDialog'
import { useDisclosure } from '@nextui-org/react'
import RowInfo from '../../components/RowInfo'
import ClickableChip from '../../components/Controls/ClickableChip'
import { AuthorizationRoles, authorizationRolesArray } from '../../model/AuthorizationRoles'
import SearchInput from '../../components/SearchInput'
import GenericInput from '../../components/GenericInput'

const UsersManagementPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [users, setUsers] = useState<UserData[]>([])
  const [editedUser, setEditedUser] = useState<UserData | null>(null)
  const [newPassword, setNewPassword] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>("")
  const [selectedAuth, setSelectedAuth] = useState<number[]>(authorizationRolesArray.map(role => role.value))

  const filteredUsers = users.filter(user => user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                                             user.lastName.toLowerCase().includes(searchValue.toLowerCase()))
                             .filter(user => selectedAuth.some(auth => user.authorizations.includes(auth)))         

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const response = await UserRepository.getAllUsers()
    if (isSuccess(response)) {
      setUsers(response.data)
      setUiState({ type: UiStateType.SUCCESS })
    }
  }

  const changeSelectedUserAuthorization = (selectedAuth: number) => {
    if (!editedUser) return

    const newAuth = editedUser.authorizations.includes(selectedAuth)
      ? editedUser.authorizations.filter(auth => auth !== selectedAuth)
      : [...editedUser.authorizations, selectedAuth]

    setEditedUser({ ...editedUser, authorizations: newAuth })
  }

  const updateUserAuthorizations = async () => {
    if (!editedUser) return;

    const res = await UserRepository.updateUserAuthorizations(editedUser.id, editedUser.authorizations)
    console.log(res)
    fetchUsers()
  }

  // const resetPassword = async () => {
  //   if (!editedUser) return;

  //   const res = await UserRepository.resetPassword(editedUser.id, newPassword)
  //   console.log(res)
  // }

  return (
    <>
      <div className="pb-4 flex items-center gap-6">
        <SearchInput value={searchValue} onValueChange={setSearchValue}/>
        <div className="flex gap-2">
          {authorizationRolesArray.map(role => (
            <ClickableChip 
              isActive={selectedAuth.includes(role.value)}
              onClick={() => { 
                setSelectedAuth(selectedAuth.includes(role.value) 
                  ? [...selectedAuth.filter(auth => auth !== role.value)]
                  : [...selectedAuth, role.value]
                )
              }}
            >
              {role.label}
            </ClickableChip>
          ))}
        </div>
      </div>
      <UsersTable 
        users={filteredUsers} 
        uiState={uiState}
        editModalProps={{ 
          isOpen, 
          onOpen, 
          onOpenChange,
          onConfirm: updateUserAuthorizations
        }}
        onUserEditSelected={(user) => setEditedUser(user)}
      />

      <ModalDialog 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        header={"Edit User Roles"}
        confirmText="Edit"
        onConfirm={updateUserAuthorizations}
        //onConfirm={resetPassword}
        size="lg"
      >
        {editedUser && <>
          <RowInfo headline="Name" body={editedUser.firstName + " " + editedUser.lastName} />
          <RowInfo headline="Email" body={editedUser.email} />
          <p className="text-md font-semibold">Authorization Roles</p>
            <div className="flex flex-wrap gap-2">
              {authorizationRolesArray.map((role) => (
                <ClickableChip 
                  key={role.value}
                  onClick={() => changeSelectedUserAuthorization(role.value)}
                  isActive={editedUser.authorizations.includes(role.value)}
                  isDisabled={role.value === AuthorizationRoles.USER}
                >
                  {role.label}
                </ClickableChip>
              ))}
            </div>
            <GenericInput 
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              type="password"
            />
        </>}
      </ModalDialog>
    </>
  )
}

export default UsersManagementPage