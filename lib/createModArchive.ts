import JSZip from "jszip";

const TEXTURE_PISTOL_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXklEQVR4nGNUU1P7z0ABYGFnZaZE/2A0oK1vGtGaq4qysLugsTyXoOb6zskM7KzM2A0g1lvUMUBR3xZDApsYNqCob8vARJRKPIAFm2BAQAD5BmzYsIEkF1DshWFgAADT8A0AfUu+4wAAAABJRU5ErkJggg==";

const TEXTURE_AMMO_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVR4nGOsiDL6z0ABYGFgYKREP3YDAvKmYFW8YVIOpS7AVDtcDRB5NGmAXTBqABUMmLPhGa1cgAkAZtQJFlNprQ4AAAAASUVORK5CYII=";

const RESOURCE_PACK_UUID = "7509d3f7-1edf-4e38-b5f3-4c2febea6a9f";
const RESOURCE_MODULE_UUID = "1a0894df-70da-45d7-a697-e1f47bb14590";
const BEHAVIOR_PACK_UUID = "ee6409b5-f8c9-4cc5-989b-8d42f25cc8e0";
const BEHAVIOR_MODULE_UUID = "662b3c16-8c6f-495f-939c-4e3bb527c22e";

const MIN_ENGINE_VERSION = [1, 19, 80];
const PACK_VERSION = [1, 0, 0];

export async function createModArchive() {
  const zip = new JSZip();
  const root = zip.folder("AgenticPistolMod");
  if (!root) {
    throw new Error("Unable to create archive root");
  }

  const resourceRoot = root.folder("resource_pack");
  const behaviorRoot = root.folder("behavior_pack");

  if (!resourceRoot || !behaviorRoot) {
    throw new Error("Unable to generate pack directories");
  }

  resourceRoot.file(
    "manifest.json",
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: "Agentic Pistol Resource Pack",
          description:
            "Textures and localization for the Agentic Bedrock pistol mod.",
          min_engine_version: MIN_ENGINE_VERSION,
          uuid: RESOURCE_PACK_UUID,
          version: PACK_VERSION
        },
        modules: [
          {
            type: "resources",
            uuid: RESOURCE_MODULE_UUID,
            version: PACK_VERSION
          }
        ]
      },
      null,
      2
    )
  );

  resourceRoot.file(
    "texts/en_US.lang",
    [
      "item.agentic:pistol.name=Pistol",
      "item.agentic:pistol_round.name=Copper Round",
      "item.agentic:pistol.description=Reliable semi-auto sidearm"
    ].join("\n")
  );

  resourceRoot.file(
    "textures/item_texture.json",
    JSON.stringify(
      {
        texture_data: {
          "agentic_pistol": {
            textures: ["textures/items/agentic_pistol"]
          },
          "agentic_pistol_round": {
            textures: ["textures/items/agentic_pistol_round"]
          }
        }
      },
      null,
      2
    )
  );

  const texturesFolder = resourceRoot.folder("textures/items");
  if (!texturesFolder) {
    throw new Error("Unable to create texture folder");
  }

  texturesFolder.file("agentic_pistol.png", TEXTURE_PISTOL_BASE64, {
    base64: true
  });
  texturesFolder.file("agentic_pistol_round.png", TEXTURE_AMMO_BASE64, {
    base64: true
  });

  resourceRoot.file("pack_icon.png", TEXTURE_PISTOL_BASE64, { base64: true });

  behaviorRoot.file(
    "manifest.json",
    JSON.stringify(
      {
        format_version: 2,
        header: {
          name: "Agentic Pistol Behavior Pack",
          description:
            "Custom items, recipes, and ranged weapon behavior for the Agentic pistol.",
          min_engine_version: MIN_ENGINE_VERSION,
          uuid: BEHAVIOR_PACK_UUID,
          version: PACK_VERSION
        },
        modules: [
          {
            type: "data",
            uuid: BEHAVIOR_MODULE_UUID,
            version: PACK_VERSION
          }
        ],
        dependencies: [
          {
            uuid: RESOURCE_PACK_UUID,
            version: PACK_VERSION
          }
        ]
      },
      null,
      2
    )
  );

  const itemsFolder = behaviorRoot.folder("items");
  if (!itemsFolder) {
    throw new Error("Unable to create behavior items folder");
  }

  itemsFolder.file(
    "pistol.json",
    JSON.stringify(
      {
        format_version: "1.19.80",
        "minecraft:item": {
          description: {
            identifier: "agentic:pistol",
            category: "Equipment"
          },
          components: {
            "minecraft:max_stack_size": 1,
            "minecraft:hand_equipped": true,
            "minecraft:icon": {
              texture: "agentic_pistol"
            },
            "minecraft:render_offsets": "bow",
            "minecraft:durability": {
              max_durability: 612,
              damage_chance: {
                min: 1,
                max: 3
              }
            },
            "minecraft:repairable": {
              repair_items: [
                {
                  items: ["minecraft:iron_ingot"],
                  repair_amount: 0.25
                }
              ]
            },
            "minecraft:cooldown": {
              category: "agentic_pistol_fire",
              duration: 0.35
            },
            "minecraft:shooter": {
              use_duration: 0.25,
              charge_on_draw: false,
              max_draw_duration: 0.0,
              scale_power_by_draw_duration: false,
              launch_power: 3.2,
              launch_power_scale: 1.0,
              ammunition: ["agentic:pistol_round", "minecraft:snowball"],
              projectiles: [
                {
                  projectile: "minecraft:snowball",
                  weight: 1
                }
              ]
            },
            "minecraft:enchantable": {
              value: 1,
              slot: "weapon"
            }
          }
        }
      },
      null,
      2
    )
  );

  itemsFolder.file(
    "pistol_round.json",
    JSON.stringify(
      {
        format_version: "1.19.80",
        "minecraft:item": {
          description: {
            identifier: "agentic:pistol_round",
            category: "Items"
          },
          components: {
            "minecraft:max_stack_size": 64,
            "minecraft:icon": {
              texture: "agentic_pistol_round"
            }
          }
        }
      },
      null,
      2
    )
  );

  const recipesFolder = behaviorRoot.folder("recipes");
  if (!recipesFolder) {
    throw new Error("Unable to create recipes folder");
  }

  recipesFolder.file(
    "agentic_pistol.json",
    JSON.stringify(
      {
        format_version: "1.19.80",
        "minecraft:recipe_shaped": {
          description: {
            identifier: "agentic:pistol"
          },
          tags: ["crafting_table"],
          pattern: ["IRI", " IG", "  I"],
          key: {
            I: {
              item: "minecraft:iron_ingot"
            },
            R: {
              item: "minecraft:redstone"
            },
            G: {
              item: "minecraft:gunpowder"
            }
          },
          result: {
            item: "agentic:pistol"
          }
        }
      },
      null,
      2
    )
  );

  recipesFolder.file(
    "agentic_pistol_rounds.json",
    JSON.stringify(
      {
        format_version: "1.19.80",
        "minecraft:recipe_shaped": {
          description: {
            identifier: "agentic:pistol_rounds"
          },
          tags: ["crafting_table"],
          pattern: ["CGC", " I ", "CGC"],
          key: {
            C: {
              item: "minecraft:copper_ingot"
            },
            I: {
              item: "minecraft:iron_nugget"
            },
            G: {
              item: "minecraft:gunpowder"
            }
          },
          result: {
            item: "agentic:pistol_round",
            count: 16
          }
        }
      },
      null,
      2
    )
  );

  return root.generateAsync({ type: "nodebuffer" });
}
