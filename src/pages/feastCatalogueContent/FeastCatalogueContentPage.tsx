import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { isStateLoading, UiState, UiStateType } from "../../communication/UiState";
import { useCallback, useEffect, useState } from "react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { Sample } from "../../model/WineSample";
import { axiosCall } from "../../communication/axios";
import UiStateHandler from "../../components/UiStateHandler";
import { Chip, ChipProps, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { GrapeVarietal } from "../../model/GrapeVarietal";
import SearchInput from "../../components/SearchInput";

const tableColumns = [
  {name: "NAME", uid: "name"},
  {name: "GRAPE", uid: "wineId.grapeVarietals"},
  {name: "COLOR", uid: "wineId.color"},
  {name: "YEAR", uid: "wineId.year"},
  {name: "WINERY", uid: "wineId.winaryId.name"},
  {name: "RATING", uid: "rating"},
];

const wineColorMap: Record<string, ChipProps["color"]>  = {
  red: "success",
  white: "danger",
  rose: "warning",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const FeastCatalogueContentPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [samples, setSamples] = useState<Sample[]>([]);
  const { id } = useParams();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchCatalogue = async () => {
      const res: CommunicationResult<Sample[]> = await axiosCall(`/catalogues/${id}/samples`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        setUiState({ type: UiStateType.SUCCESS })
      
        setSamples(res.data);
      } else {
        setUiState({ 
          type: UiStateType.ERROR,
          message: res.message
        })
      }
    }
    
    fetchCatalogue();
  }, [id, accessToken]);

  const renderCell = useCallback((sample: Sample, columnKey: React.Key) => {
    const cellValue = getNestedValue(sample, columnKey as string);

    switch (columnKey) {
      case "actions":
        return (
          <div>
            {/* Add your action buttons here */}
            <button>Edit</button>
            <button>Delete</button>
          </div>
        );
      case "wineId.grapeVarietals":
        return cellValue?.map((grape: GrapeVarietal) => grape.grape).join(", ");
      case "wineId.color":
        return (
          <Chip className="capitalize" color={wineColorMap[sample.wineId.color]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "rating":
        return sample.champion ? ("🏆 " + cellValue) : cellValue;
      default:
        return cellValue;
    }
  }, []);


  return (
    <div>
      <UiStateHandler uiState={uiState} />
      <div className="flex items-center py-4">
        <p className="text-sm flex-1">Number of samples: {samples.length}</p>
        <SearchInput value="" onValueChange={() => {}} />
      </div>
      <Table isStriped aria-label="Example table with custom cells">
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isStateLoading(uiState)} loadingContent={<Spinner color="primary"/>} items={samples}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default FeastCatalogueContentPage