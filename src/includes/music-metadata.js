import { parseFile } from "music-metadata";

export default {
  install(app) {
    app.mixin({
      methods: {
        async getMetadata(file) {
          try {
            const metadata = await parseFile(file);
            return metadata;
          } catch (error) {
            console.error(error);
          }
        },
      },
    });
  },
};
