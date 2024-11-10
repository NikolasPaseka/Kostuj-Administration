import { Slider } from '@nextui-org/react';
import React, { useEffect } from 'react'
import { TypeChecker } from '../../utils/TypeChecker';
import ModalDialog from '../ModalDialog';
import ClickableChip from '../Controls/ClickableChip';
import { RangeFilter } from '../../model/Domain/RangeFilter';

const maxYear = new Date().getFullYear();

type Props = {
  isOpen: boolean,
  onOpenChange: () => void,
  maxRating: number,
  minYear: number,
  ratingCommissions: (number | null)[],
  onApplyFilter: (yearRange: RangeFilter, ratingRange: RangeFilter, ratingCommissions: (number | null)[] | null) => void
}

const WineFilterModal = ({ isOpen, onOpenChange, maxRating, minYear, ratingCommissions, onApplyFilter }: Props) => {
  const [yearRange, setYearRange] = React.useState<RangeFilter>({min: minYear, max: maxYear});
  const [ratingRange, setRatingRange] = React.useState<RangeFilter>({min: 0, max: maxRating});

  const [allRatingCommissions, setAllRatingCommissions] = React.useState<boolean>(true);
  const [selectedRatingCommission, setSelectedRatingCommission] = React.useState<(number | null)[]>([]);

  useEffect(() => {
    setSelectedRatingCommission(ratingCommissions.sort((a, b) => (a ?? 0) - (b ?? 0)));
  }, [ratingCommissions])

  return (
    <ModalDialog
      header="Filter wine samples"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={() => 
        onApplyFilter(yearRange, ratingRange, allRatingCommissions ? null : selectedRatingCommission)
      }
    >
      <Slider 
        label={<p>Select a wine year range</p>}
        step={1}
        maxValue={maxYear}
        minValue={minYear}
        value={[yearRange.min, yearRange.max]} 
        onChange={(sliderValue) => TypeChecker.isArray(sliderValue) ? setYearRange({ min: sliderValue[0], max: sliderValue[1] }) : {}}
        className="max-w-md"
      />

      <Slider 
        label="Select a rating range"
        step={1}
        maxValue={maxRating}
        minValue={0}
        value={[ratingRange.min, ratingRange.max]} 
        onChange={(sliderValue) => TypeChecker.isArray(sliderValue) ? setRatingRange({ min: sliderValue[0], max: sliderValue[1] }) : {}}
        className="max-w-md"
      />

      <p>Select rating commission</p>
      <div className="flex flex-row flex-wrap gap-2">
        <ClickableChip
          isActive={allRatingCommissions} 
          onClick={() => {
            setAllRatingCommissions(!allRatingCommissions);
            setSelectedRatingCommission(allRatingCommissions ? [] : ratingCommissions);
          }}
        >
          All
        </ClickableChip>
        {ratingCommissions.map((ratingCommission) => (
          <ClickableChip 
            key={ratingCommission ?? "null"}
            isActive={selectedRatingCommission.includes(ratingCommission)}
            isDisabled={allRatingCommissions}
            onClick={() => {
              if (selectedRatingCommission.includes(ratingCommission)) {
                setSelectedRatingCommission(selectedRatingCommission.filter((rating) => rating !== ratingCommission));
              } else {
                setSelectedRatingCommission([...selectedRatingCommission, ratingCommission]);
              }
            }}
          >
            {ratingCommission ?? "None"}
          </ClickableChip>
        ))}
      </div>
    </ModalDialog>
  )
}

export default WineFilterModal