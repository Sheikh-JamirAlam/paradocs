import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    deleteBackward: {
      deleteBackward: () => void;
    };
  }
}

export const CustomDeleteBackward = Extension.create({
  addCommands() {
    return {
      deleteBackward:
        () =>
        ({ tr }) => {
          const { $from, $to } = tr.selection;
          const from = tr.mapping.map($from.pos);
          const to = tr.mapping.map($to.pos);
          console.log("from", from);
          console.log("to", to);
          tr.delete(from, to);
          return true;
        },
    };
  },
});

export const PreserveSpaces = Extension.create({
  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        editor.commands.insertContent("\u00A0");
        return true;
      },
    };
  },
});

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});
