import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function SelectInput({
  values,
  selected,
  setSelected,
  header,
  error,
}: {
  values: { id?: string; name: string; value?: string }[];
  selected: string | null;
  setSelected: (value: string) => void; // Changed type definition to accept a function
  header: string;
  error: string | undefined; // Changed to match potential undefined error from react-hook-form
}) {
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);
  const [filteredValues, setFilteredValues] = useState(values);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      const filtered = values.filter((value) =>
        value.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
      setFilteredValues(filtered);
    } else {
      setFilteredValues(values);
    }
  }, [debouncedQuery, values]);

  useEffect(() => {
    if (selected) {
      const selectedValue = values.find((value) => value.id === selected);
      if (selectedValue) {
        setQuery(selectedValue.name);
      }
    } else {
      setQuery(null);
    }
  }, [selected, values]);

  return (
    <div ref={selectRef} className="flex flex-col gap-2 w-full relative">
      <label htmlFor={header} className="text-sm font-semibold text-gray-700">
        {header}
      </label>
      <input
        autoComplete="off"
        id={header}
        value={query || ""}
        type="text"
        placeholder={`${header}..`}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        className={`border border-gray-200 bg-white rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-700 w-full ${
          error && "ring-1 ring-red-500"
        }`}
      />
      {open && (
        <div className="flex flex-col gap-2 w-full max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-1 bg-white z-10 absolute top-20">
          {filteredValues.length === 0 ? (
            <div className="flex justify-center items-center p-2 text-gray-500 text-sm">
              No results found
            </div>
          ) : (
            filteredValues.map((value) => (
              <div
                key={value.id}
                onClick={() => {
                  setSelected(value.id || ""); // Call the function with the id value
                  setOpen(false); // Close dropdown after selection
                }}
                className={`flex flex-row justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer ${
                  selected === value.id && "bg-gray-100"
                }`}
              >
                <p> {value.name}</p>
                {selected === value.id && <Check />}
              </div>
            ))
          )}
        </div>
      )}
      <span className="text-red-500 text-xs">{error && error}</span>
    </div>
  );
}
