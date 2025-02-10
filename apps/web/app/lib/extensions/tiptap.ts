import { Extension } from "@tiptap/core";

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
