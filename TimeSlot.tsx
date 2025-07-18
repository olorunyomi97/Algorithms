import { useEffect, useState } from "react";
import styled from "styled-components";
import { PlusIcon } from "src/components/icons";
import { X } from "lucide-react";
import {
    BodyMediumSemiBold,
    BodyMediumSemi,
} from "src/components/typography/bodyMedium";

import { CaptionLargeMedium } from "src/components/typography/caption";
// Styled Components
const Container = styled.div`
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f4f6;
    width: 100%;
`;

const DayLabel = styled.div`
    width: 5rem;
`;

const TimeSlotsContainer = styled.div`
    flex: 1;
    padding: 0 1rem;
`;

const NoAppointmentContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
`;

const NoAppointmentDot = styled.div`
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    margin-right: 0.5rem;
    background-color: #f8eedf;
`;

const TimeSlotsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`;

const TimeSlotGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
`;

const TimeSelector = styled.div`
    position: relative;
`;

const TimeButton = styled.span<{ isActive?: boolean }>`
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    min-width: 100px;
    text-align: center;

    &:hover {
        background-color: #f9fafb;
        border: 2px solid #fee0c4;
        box-shadow: 0px 2px 4px -1px rgba(16, 25, 40, 0.05),
            0px 5px 13px -5px rgba(16, 25, 40, 0.2);
    }
    ${(props) =>
        props.isActive &&
        `
      border: 2px solid #fee0c4;
    `}
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    z-index: 2000;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0px 2px 4px -1px rgba(16, 25, 40, 0.05),
        0px 5px 13px -5px rgba(16, 25, 40, 0.2);
    max-height: 12rem;
    overflow-y: auto;
    transform: scale(1);
    opacity: 1;
    transition: all 0.2s ease-in-out;
    min-width: 120px;
`;

const DropdownItem = styled.div`
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #374151;
    transition: background-color 0.15s ease;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const TimeSeparator = styled.span`
    color: #6b7280;
`;

const RemoveButton = styled.button`
    color: #9ca3af;
    padding: 0 2rem;
    transition: color 0.2s ease;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        color: #4b5563;
    }
`;

const StyleWrapper = styled.div<{ isActive: boolean }>`
    transition: all 0.2s ease-in-out;
    border-radius: 0.5rem;
    border: 5px solid transparent;

    &:hover {
        border: 5px solid #fed1a833;
        border-radius: 0.8rem;
    }

    ${(props) =>
        props.isActive &&
        `
      border: 5px solid #FED1A833;
      border-radius: 0.8rem;
    `}
`;

// Component props interface
interface TimeSlotProps {
    day?: string;
    defaultSlot?: { start: string; end: string };
    noAppointment?: boolean;
    slotss?: { start: string; end: string }[];
    isLoading?: boolean;
    onChange?: (slots: { start: string; end: string }[]) => void;
}

// Available time options for dropdown
const TIME_OPTIONS = [
    "7:00 am",
    "7:30 am",
    "8:00 am",
    "8:30 am",
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:00 pm",
    "12:30 pm",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
    "5:00 pm",
    "5:30 pm",
    "6:00 pm",
];

// Default time slot placeholder
const DEFAULT_TIME = "Select Time";

const TimeSlot = ({
    day,
    defaultSlot,
    noAppointment = false,
    onChange,
    slotss,
    isLoading,
}: TimeSlotProps) => {
    // State management
    const [slots, setSlots] = useState<{ start: string; end: string }[]>(
        slotss ? [...slotss] : []
    );

    // useEffect(() => {
    //   if (slotss && slotss.length > 0) {
    //     setSlots([...slotss]);
    //   }
    // }, [slotss]);

    useEffect(() => {
        if (
            slotss &&
            slotss.length > 0 &&
            JSON.stringify(slotss) !== JSON.stringify(slots)
        ) {
            setSlots([...slotss]);
        }
    }, [slotss]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<"start" | "end" | null>(
        null
    );

    //  for the styking
    const [activeTimeSlot, setActiveTimeSlot] = useState<{
        index: number;
        field: "start" | "end";
    } | null>(null);

    useEffect(() => {
        onChange?.(slots);
    }, [slots, onChange]);

    // Update time for a specific slot
    const updateTime = (
        index: number,
        field: "start" | "end",
        value: string
    ) => {
        const updatedSlots = [...slots];
        updatedSlots[index][field] = value;
        setSlots(updatedSlots);

        // Reset editing state
        setEditingIndex(null);
        setEditingField(null);
        setActiveTimeSlot(null);
    };

    // Remove a time slot
    const removeSlot = (index: number) => {
        const filteredSlots = slots.filter((_, i) => i !== index);
        setSlots(filteredSlots);
        setActiveTimeSlot(null);
    };

    // Add a new time slot
    // const addSlot = () => {
    //     // const newSlot = { start: DEFAULT_TIME, end: DEFAmLT_TIME };
    //     const newSlot = { start: "8:00 am", end: "6:00 pm" };
    //     setSlots([...slots, newSlot]);
    // };

    const addSlot = () => {
        const newSlot = { start: DEFAULT_TIME, end: DEFAULT_TIME };
        setSlots([...slots, newSlot]);
    };

    // Updated getAvailableTimes function that prevents overlapping slots
    const getAvailableTimes = (
        currentSlot: { start: string; end: string },
        field: "start" | "end"
    ) => {
        return TIME_OPTIONS.filter((time) => {
            const currentIndex = TIME_OPTIONS.indexOf(time);

            // Get all other slots (exclude current slot being edited)
            const otherSlots = slots.filter((s, index) => {
                // Find the index of the current slot being edited
                const editingSlotIndex = slots.findIndex(slot => slot === currentSlot);
                return index !== editingSlotIndex;
            });

            // Check if this time conflicts with any existing time slots
            const hasConflict = otherSlots.some((otherSlot) => {
                const otherStartIndex = TIME_OPTIONS.indexOf(otherSlot.start);
                const otherEndIndex = TIME_OPTIONS.indexOf(otherSlot.end);
                
                // Skip if the other slot has default times
                if (otherSlot.start === DEFAULT_TIME || otherSlot.end === DEFAULT_TIME) {
                    return false;
                }

                if (field === "start") {
                    // For start time, check if it falls within any existing slot's range
                    return currentIndex >= otherStartIndex && currentIndex < otherEndIndex;
                } else {
                    // For end time, we need to check against the current slot's start time
                    const currentSlotStartIndex = TIME_OPTIONS.indexOf(currentSlot.start);
                    
                    // Skip if current slot doesn't have a start time selected
                    if (currentSlot.start === DEFAULT_TIME) {
                        return false;
                    }
                    
                    // Check if the proposed time range would overlap with existing slots
                    // The new slot would be from currentSlotStartIndex to currentIndex
                    return !(currentIndex <= otherStartIndex || currentSlotStartIndex >= otherEndIndex);
                }
            });

            if (hasConflict) return false;

            // Enforce logical order between start and end within the same slot
            if (field === "start") {
                const endIndex = TIME_OPTIONS.indexOf(currentSlot.end);
                return (
                    currentSlot.end === DEFAULT_TIME ||
                    (endIndex !== -1 && currentIndex < endIndex)
                );
            } else {
                const startIndex = TIME_OPTIONS.indexOf(currentSlot.start);
                return (
                    currentSlot.start === DEFAULT_TIME ||
                    (startIndex !== -1 && currentIndex > startIndex)
                );
            }
        });
    };

    // Handle time field click
    const handleTimeClick = (index: number, field: "start" | "end") => {
        setEditingIndex(index);
        setEditingField(field);
        setActiveTimeSlot({ index, field });
    };

    // Handle clicking outside to close dropdown
    const handleClickOutside = () => {
        setEditingIndex(null);
        setEditingField(null);
        setActiveTimeSlot(null);
    };

    // Add click outside listener
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (editingIndex !== null) {
                const target = e.target as HTMLElement;
                if (!target.closest(".dropdown-container")) {
                    handleClickOutside();
                }
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [editingIndex]);

    // Check if should show "No Appointment" state
    const showNoAppointment = noAppointment || slots.length === 0;

    const isTimeSlotActive = (
        index: number,
        field: "start" | "end"
    ): boolean => {
        return (
            activeTimeSlot?.index === index && activeTimeSlot?.field === field
        );
    };

    return (
        <Container>
            {/* Day Label */}
            <DayLabel>
                <CaptionLargeMedium className="text-cp365-grey-700">
                    {day}
                </CaptionLargeMedium>
            </DayLabel>

            {/* Time Slots Container */}
            <TimeSlotsContainer>
                {showNoAppointment ? (
                    <NoAppointmentContainer>
                        <NoAppointmentDot />
                        <BodyMediumSemiBold className="text-cp365-grey-500 px-4 py-0">
                            {isLoading ? "Loading..." : "No Appointment"}
                        </BodyMediumSemiBold>
                    </NoAppointmentContainer>
                ) : (
                    // Time Slots List
                    <TimeSlotsList>
                        {slots.map((slot, index) => (
                            <TimeSlotGroup
                                key={index}
                                className="dropdown-container"
                            >
                                {/* Start Time */}
                                <TimeSelector>
                                    {editingIndex === index &&
                                        editingField === "start" && (
                                            <DropdownMenu>
                                                {getAvailableTimes(
                                                    slot,
                                                    "start"
                                                ).map((time) => (
                                                    <DropdownItem
                                                        key={time}
                                                        onClick={() =>
                                                            updateTime(
                                                                index,
                                                                "start",
                                                                time
                                                            )
                                                        }
                                                    >
                                                        <BodyMediumSemi>
                                                            {time}
                                                        </BodyMediumSemi>
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        )}
                                    <StyleWrapper
                                        isActive={isTimeSlotActive(
                                            index,
                                            "start"
                                        )}
                                    >
                                        <TimeButton
                                            isActive={isTimeSlotActive(
                                                index,
                                                "start"
                                            )}
                                            onClick={() => {
                                                handleTimeClick(index, "start");
                                            }}
                                        >
                                            <BodyMediumSemiBold>
                                                {slot.start}
                                            </BodyMediumSemiBold>
                                        </TimeButton>
                                    </StyleWrapper>
                                </TimeSelector>

                                {/* Time Separator */}
                                <TimeSeparator>-</TimeSeparator>

                                {/* End Time */}
                                <TimeSelector>
                                    {editingIndex === index &&
                                        editingField === "end" && (
                                            <DropdownMenu>
                                                {getAvailableTimes(
                                                    slot,
                                                    "end"
                                                ).map((time: any) => (
                                                    <DropdownItem
                                                        key={time}
                                                        onClick={() =>
                                                            updateTime(
                                                                index,
                                                                "end",
                                                                time
                                                            )
                                                        }
                                                    >
                                                        <BodyMediumSemi>
                                                            {time}
                                                        </BodyMediumSemi>
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        )}
                                    <StyleWrapper
                                        isActive={isTimeSlotActive(
                                            index,
                                            "end"
                                        )}
                                    >
                                        <TimeButton
                                            isActive={isTimeSlotActive(
                                                index,
                                                "end"
                                            )}
                                            onClick={() =>
                                                handleTimeClick(index, "end")
                                            }
                                        >
                                            <BodyMediumSemiBold>
                                                {slot.end}
                                            </BodyMediumSemiBold>
                                        </TimeButton>
                                    </StyleWrapper>
                                </TimeSelector>

                                {/* Remove Slot Button */}
                                <RemoveButton
                                    onClick={() => removeSlot(index)}
                                    aria-label="Remove time slot"
                                >
                                    <X className="h-4 w-4" />
                                </RemoveButton>
                            </TimeSlotGroup>
                        ))}
                    </TimeSlotsList>
                )}
            </TimeSlotsContainer>

            {/* Add Slot Button */}
            <PlusIcon
                onClick={addSlot}
                className="text-cp365-grey-600 hover:text-black cursor-pointer mr-10"
            />
        </Container>
    );
};

export default TimeSlot;