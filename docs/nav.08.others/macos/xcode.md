# 解决 gyp: No Xcode or CLT version detected! 报错

```bash
xcode-select --print-path
# in my case /Library/Developer/CommandLineTools

# the next line deletes the path returned by the command above
sudo rm -rf $(xcode-select --print-path)

# install them (again) if you don't get a default installation prompt
xcode-select --install
```
