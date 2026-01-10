import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

const commands = [
  {
    title: "Heading",
    description: "Large section heading",
    command: ({ editor }) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    title: "Bold",
    description: "Bold text",
    command: ({ editor }) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  {
    title: "Quote",
    description: "Block quote",
    command: ({ editor }) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Code snippet",
    command: ({ editor }) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a list",
    command: ({ editor }) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    title: "Center Text",
    description: "Center align paragraph",
    command: ({ editor }) => {
      editor.chain().focus().setTextAlign("center").run();
    },
  },
];

export const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        items: ({ query }) => {
          return commands.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: props => {
              component = document.createElement("div");
              component.className =
                "slash-menu bg-[#0f1117] border border-white/10 rounded-xl shadow-xl p-1 w-64";

              updateComponent(props);

              document.body.appendChild(component);
              position(props);
            },

            onUpdate(props) {
              updateComponent(props);
              position(props);
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                component.remove();
                return true;
              }
              return false;
            },

            onExit() {
              component.remove();
            },
          };

          function updateComponent(props) {
            component.innerHTML = "";

            props.items.forEach((item, index) => {
              const button = document.createElement("button");
              button.className =
                "w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm";

              button.innerHTML = `
                <div class="text-white">${item.title}</div>
                <div class="text-xs text-white/50">${item.description}</div>
              `;

              button.onclick = () => {
                item.command(props);
              };

              component.appendChild(button);
            });
          }

          function position(props) {
            const { clientRect } = props;
            if (!clientRect) return;

            component.style.position = "absolute";
            component.style.left = `${clientRect().left}px`;
            component.style.top = `${clientRect().bottom + 6}px`;
            component.style.zIndex = 50;
          }
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
