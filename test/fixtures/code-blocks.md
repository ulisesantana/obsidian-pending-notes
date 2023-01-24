# Code blocks

This are examples of [[code blocks]]:

```
# ${ZSH_CUSTOM}/volta.zsh
VOLTA_HOME="$HOME/.volta"
if [[ -d $VOLTA_HOME ]]; then
    path=("$VOLTA_HOME/bin" $path)
    export PATH
    export VOLTA_HOME
fi
```

```bash
# ${ZSH_CUSTOM}/volta.zsh
VOLTA_HOME="$HOME/.volta"
if [[ -r $VOLTA_HOME ]]; then
    path=("$VOLTA_HOME/bin" $path)
    export PATH
    export VOLTA_HOME
fi
```

This is [[inline code]] `[[ -i $VOLTA_HOME ]]`.
