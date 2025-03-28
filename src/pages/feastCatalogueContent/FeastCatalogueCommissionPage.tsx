import { UiStateType } from "../../communication/UiState"
import CommissionTable from "../../components/Tables/CommissionTable/CommissionTable"

const FeastCatalogueCommissionPage = () => {
  return (
    <div>
      {/* TODO: do not mock */}
      <CommissionTable 
        commissions={[{
          id: "1", 
          commissionNumber: 1,
          numberOfSamples: 40,
          assignedUser: "Nikolas Paseka"
        },
        {
          id: "1", 
          commissionNumber: 2,
          numberOfSamples: 40
        },
        {
          id: "1", 
          commissionNumber: 3,
          numberOfSamples: 40
        },
        {
          id: "1", 
          commissionNumber: 4,
          numberOfSamples: 40
        },
        {
          id: "1", 
          commissionNumber: 5,
          numberOfSamples: 39
        }
        ]}
        uiState={{ type: UiStateType.SUCCESS }}
      />
    </div>
  )
}

export default FeastCatalogueCommissionPage