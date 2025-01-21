import { useState } from 'react';
import { Catalogue } from '../../../model/Catalogue';
import { CatalogueRepository } from '../../../communication/repositories/CatalogueRepository';
import { resolveUiState, UiState, UiStateType } from '../../../communication/UiState';
import UiStateHandler from '../../../components/UiStateHandler';
import { UserData } from '../../../model/UserData';
import { isSuccess } from '../../../communication/CommunicationsResult';
import CardGeneric from '../../../components/CardGeneric';
import { Accordion, AccordionItem, Spacer, User } from "@heroui/react";
import { ShareIcon, TrashIcon } from '@heroicons/react/24/solid';
import useCatalogueOwnerCheck from '../../../hooks/useCatalogueOwnerCheck';
import IconButton from '../../../components/IconButton';

const UserRow = ({ user, isAdmin, onRemove, showOwnerAction }: { user: UserData; isAdmin: boolean, showOwnerAction: boolean, onRemove: () => void }) => {
  return (
    <div
      className="flex justify-between items-center border-b pb-2 border-gray-200 gap-8"
    >
      <User
        avatarProps={{radius: "lg", src: user.avatarImageUrl}}
        name={user.firstName + ' ' + user.lastName}
        description={user.email}
      />
      <div className="flex flex-row items-center gap-4">
        <p className="text-sm text-gray-600 italic">{isAdmin ? "Owner" : "Co-organizator"}</p>
        {showOwnerAction && !isAdmin &&
          <IconButton
            icon={<TrashIcon className='w-5 h-5 text-secondary' />}
            onClick={() => onRemove() }
            withBackground={true}
          />
        }
      </div>
    </div>
  )
}

type Props = {
  coOrganizers: UserData[];
  catalogue: Catalogue;
  onRemove: (email: string) => void;
  onAdd: (coorganizator: UserData) => void;
  className?: string;
}

const CatalogueCoorganizators = ({ coOrganizers, catalogue, onRemove, onAdd, className }: Props) => {

  const [newOrganizerEmail, setNewOrganizerEmail] = useState('');
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.IDLE});

  const { isAdminOwner } = useCatalogueOwnerCheck({ catalogue });

  const addCoorganizator = async () => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.addCoorganizator(catalogue.id, newOrganizerEmail);
    resolveUiState(res, setUiState);
    if (isSuccess(res)) {
      onAdd(res.data);
    }
  }

  const removeCoorganizator = async (coorganizatorId: string) => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.removeCoorganizator(catalogue.id, coorganizatorId);
    resolveUiState(res, setUiState);
    if (isSuccess(res)) {
      onRemove(coorganizatorId);
    }
  }

  return (
    <CardGeneric
      header={<h2 className="text-lg font-bold">Co-Organizers</h2>}
      className={className}
    >  
      {catalogue.fetchedAdmin &&
        <UserRow
          user={catalogue.fetchedAdmin}
          isAdmin={true}
          onRemove={() => {}}
          showOwnerAction={isAdminOwner()}
        />
      }
      <Spacer className='pb-2' />
      {/* List of co-organizers */}
      {coOrganizers.map((organizer, index) => (
        <UserRow
          key={index}
          user={organizer}
          isAdmin={false}
          onRemove={() => removeCoorganizator(organizer.id)}
          showOwnerAction={isAdminOwner()}
        />
      ))}

      {isAdminOwner() &&
          <Accordion isCompact className="my-2">
            <AccordionItem key="1" aria-label="Accordion" title="Click to share catalogue" startContent={<ShareIcon className='w-5 h-5 text-secondary' />}>
                {/* Input for adding new co-organizer */}
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter user email"
                    value={newOrganizerEmail}
                    onChange={(e) => setNewOrganizerEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded-l-md flex-grow"
                  />
                  <button
                    onClick={addCoorganizator}
                    className="bg-red-500 text-white p-2 rounded-r-md hover:bg-red-600"
                  >
                    Add
                  </button>
                </div>
            </AccordionItem>
          </Accordion>
      }

      <UiStateHandler uiState={uiState} />

    </CardGeneric>
  );
};

export default CatalogueCoorganizators;