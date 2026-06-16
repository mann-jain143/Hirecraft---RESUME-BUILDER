import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

const DraggableList = ({ items, onReorder, renderItem, droppableId = 'list' }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  if (!items.length) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {items.map((item, index) => (
              <Draggable key={`${droppableId}-${index}`} draggableId={`${droppableId}-${index}`} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={`relative group ${snapshot.isDragging ? 'z-10' : ''}`}
                  >
                    <div
                      {...dragProvided.dragHandleProps}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-indigo-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className={snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500/50 rounded-xl' : ''}>
                      {renderItem(item, index)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
