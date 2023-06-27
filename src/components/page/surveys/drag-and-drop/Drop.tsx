import { Droppable } from "react-beautiful-dnd";

type DropProps = {
  id: string;
  onDragEnd: (result: any) => void;
};

export const Drop = ({ id, onDragEnd, ...props }: DropProps) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver ? "droppable dropping" : "droppable"
            }
            {...provided.droppableProps}
            {...props}
          >
            {props.children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};
