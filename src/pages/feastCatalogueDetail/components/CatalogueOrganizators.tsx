import React, { useState } from 'react';
import { Catalogue } from '../../../model/Catalogue';
import { CatalogueRepository } from '../../../communication/repositories/CatalogueRepository';
import { resolveUiState, UiState, UiStateType } from '../../../communication/UiState';
import UiStateHandler from '../../../components/UiStateHandler';
import { UserData } from '../../../model/UserData';
import { isSuccess } from '../../../communication/CommunicationsResult';
import CardGeneric from '../../../components/CardGeneric';
import { Accordion, AccordionItem, User } from '@nextui-org/react';
import PrimaryButton from '../../../components/PrimaryButton';
import { ShareIcon } from '@heroicons/react/24/solid';

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

  const addCoorganizator = async () => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.addCoorganizator(catalogue.id, newOrganizerEmail);
    resolveUiState(res, setUiState);
    if (isSuccess(res)) {
      onAdd(res.data);
    }
  }

  return (
    <CardGeneric
      header={<h2 className="text-lg font-bold">Co-Organizers</h2>}
      className={className}
    >
      {/* List of co-organizers */}
      {coOrganizers.map((organizer, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b pb-2 border-gray-200 gap-8"
        >
          <User
            avatarProps={{radius: "lg", src: organizer.avatarImageUrl}}
            name={organizer.firstName + ' ' + organizer.lastName}
            description={organizer.email}
          />

          <PrimaryButton
            isSecondary
            size='sm'
            onClick={() => onRemove(organizer.email)}
          >
            Remove
          </PrimaryButton>
        </div>
      ))}

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

      <UiStateHandler uiState={uiState} />

    </CardGeneric>
  );
};

export default CatalogueCoorganizators;