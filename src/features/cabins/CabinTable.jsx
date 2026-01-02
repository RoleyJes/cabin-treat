import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router";
import Empty from "../../ui/Empty";

function CabinTable() {
  const { isPending, error, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;

  if (error) return <p>Something went wrong: {error.message}</p>;

  if (!cabins.length) return <Empty resourceName="cabins" />;

  // For filtering the cabins. You can look up Filter.jsx and CabinTableOperations.jsx
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // For Sorting the cabins.
  const sortBy = searchParams.get("sortBy") || "created_at-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = [...filteredCabins].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    // Sorting by the created date, need to convert it to date to be safe.
    if (field === "created_at") {
      return (new Date(a.created_at) - new Date(b.created_at)) * modifier;
    }

    // String sorting (name)
    if (typeof valueA === "string") {
      return (
        valueA.localeCompare(valueB, undefined, {
          sensitivity: "base",
        }) * modifier
      );
    }

    // Number sorting (other sorted fields from the database is int)
    return (valueA - valueB) * modifier;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          // data={cabins}
          // data={filteredCabins}
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
