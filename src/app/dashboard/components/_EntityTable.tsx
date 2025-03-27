import Image from "next/image";

type EntityTableProps = {
  entities: any[];
  handleEdit?: (entity: any) => void;
  handleDelete?: (entity: any) => void;
};

export function EntityTable({
  entities,
  handleEdit,
  handleDelete,
}: EntityTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>date of creation</th>
          {handleEdit && handleDelete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {entities.map((entity) => (
          <tr key={entity.id}>
            <td>{entity.id}</td>
            <td>{entity.user_metadata.display_name}</td>
            <td>
              {new Date(entity.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
            {handleEdit && handleDelete && (
              <td className="actions-column">
                <button onClick={() => handleEdit(entity)}>
                  <Image
                    src={"/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </button>

                <button onClick={() => handleDelete(entity)}>
                  <Image
                    src={"/icons/trash.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
