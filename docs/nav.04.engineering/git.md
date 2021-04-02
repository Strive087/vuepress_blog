# Git使用手册

## 简介

先说下git的概念和svn的差别。

![2xFmnZ](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/2xFmnZ.jpg)

Git是分布式版本控制系统，，每个人的电脑上都是一个完整的版本库，这样，你工作的时候，就不需要联网了，因为版本库就在你自己的电脑上。既然每个人电脑上都有一个完整的版本库，那多个人如何协作呢？比方说你在自己电脑上改了文件A，你的同事也在他的电脑上改了文件A，这时，你们俩之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

![giHLM3](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/giHLM3.jpg)

SVN是集中式版本控制系统，版本库是集中存放在中央服务器的，而干活的时候，用的都是自己的电脑，所以要先从中央服务器取得最新的版本，然后开始干活，干完活了，再把自己的活推送给中央服务器。中央服务器就好比是一个图书馆，你要改一本书，必须先从图书馆借出来，然后回到家自己改，改完了，再放回图书馆。

## 暂存区

我们初始化创建git版本库后，工作区目录下会有个`.git`的目录，这个目录就是git版本库。

Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支master，以及指向master的一个指针叫HEAD。

![MSlMMF](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/MSlMMF.jpg)

我们把文件往Git版本库里添加的时候，是分两步执行的：

1. 用`git add`把文件添加进去，实际上就是把文件修改添加到暂存区；

2. 用`git commit`提交更改，实际上就是把暂存区的所有内容提交到当前分支。

因为我们创建Git版本库时，Git自动为我们创建了唯一一个`master`分支，所以，现在，`git commit`就是往`master`分支上提交更改。

## 撤销修改或删除

1. 当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令`git checkout -- [filename]`

2. 当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令 `git reset HEAD [filename]`，就回到了场景1，第二步按场景1操作。

3. 已经提交了不合适的修改到版本库时，想要撤销本次提交，需要进行版本回退，不过前提是没有推送到远程库。

4. 如果删错了，还没提交，版本库里还有，可以用`git checkout -- [filename]`还原。需要注意从来没有被添加到版本库就被删除的文件，是无法恢复的！

5. 如果删错了，并且提交了，可以使用 `git reset --hard HEAD^`还原。

## 远程仓库

GitHub提供Git仓库托管服务的，所以，只要注册一个GitHub账号，就可以免费获得Git远程仓库。

由于你的本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以，需要一点设置：

第1步：创建SSH Key。在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有id_rsa和id_rsa.pub这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：

```sh
ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个Key也不是用于军事目的，所以也无需设置密码。

如果一切顺利的话，可以在用户主目录里找到.ssh目录，里面有id_rsa和id_rsa.pub两个文件，这两个就是SSH Key的秘钥对，id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人。

第2步：登陆GitHub，打开“Account settings”，“SSH Keys”页面：

然后，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴id_rsa.pub文件的内容：

![T90l1L](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/T90l1L.png)

点“Add Key”，你就应该看到已经添加的Key。

为什么GitHub需要SSH Key呢？因为GitHub需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而Git支持SSH协议，所以，GitHub只要知道了你的公钥，就可以确认只有你自己才能推送。

当然，GitHub允许你添加多个Key。假定你有若干电脑，你一会儿在公司提交，一会儿在家里提交，只要把每台电脑的Key都添加到GitHub，就可以在每台电脑上往GitHub推送了。

### 关联远程仓库

先有本地库，后有远程库的时候，我们可以关联远程库。

要关联一个远程库，使用命令`git remote add origin git@server-name:path/repo-name.git`

关联一个远程库时必须给远程库指定一个名字，`origin`是默认习惯命名；

使用命令`git push -u origin master`第一次推送master分支的所有内容。由于远程库是空的，我们第一次推送master分支时，加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。

此后，每次本地提交后，只要有必要，就可以使用命令`git push origin master`推送最新修改；

如果添加的时候地址写错了，或者就是想删除远程库，可以用`git remote rm [name]`命令。使用前，建议先用`git remote -v`查看远程库信息，根据名字删除。

### 克隆远程仓库

我们从零开发，那么最好的方式是先创建远程库，然后，从远程库克隆。

远程库已经准备好了，下一步是用命令git clone克隆一个本地库：

```sh
git clone git@github.com:michaelliao/gitskills.git
```

实际上，Git支持多种协议，默认的git://使用ssh，但也可以使用https等其他协议。

## 分支管理

先介绍分支的概念：

一开始的时候，master分支是一条线，Git用master指向最新的提交，再用HEAD指向master，就能确定当前分支，以及当前分支的提交点：

![6i16E9](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/6i16E9.png)

每次提交，master分支都会向前移动一步，这样，随着你不断提交，master分支的线也越来越长。

当我们创建新的分支，例如dev时，Git新建了一个指针叫dev，指向master相同的提交，再把HEAD指向dev，就表示当前分支在dev上：

![QEBoLf](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/QEBoLf.png)

你看，Git创建一个分支很快，因为除了增加一个dev指针，改改HEAD的指向，工作区的文件都没有任何变化！

不过，从现在开始，对工作区的修改和提交就是针对dev分支了，比如新提交一次后，dev指针往前移动一步，而master指针不变：

![h2Ah5w](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/h2Ah5w.png)

假如我们在dev上的工作完成了，就可以把dev合并到master上。Git怎么合并呢？最简单的方法，就是直接把master指向dev的当前提交，就完成了合并：

![poRiSK](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/poRiSK.png)

所以Git合并分支也很快！就改改指针，工作区内容也不变！

合并完分支后，甚至可以删除dev分支。删除dev分支就是把dev指针给删掉，删掉后，我们就剩下了一条master分支：

![ixGyOq](https://zhuduanlei-1256381138.cos.ap-guangzhou.myqcloud.com/uPic/ixGyOq.png)

### 新建与合并分支

新建分支并切换到新建的分支：

```sh
git branch dev
git switch master
# 下面命令等价于上面的两个命令
 git switch -c dev
```

`git branch`命令会列出所有分支，当前分支前面会标一个*号。

合并分支，把dev分支的工作成果合并到master分支上：

```sh
git merge dev
```

`git merge`命令用于合并指定分支到当前分支。合并后，再查看文件内容，就可以看到，和dev分支的最新提交是完全一样的。

删除分支：

```sh
git branch -d dev
```

### 解决冲突

当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。

解决冲突就是把Git合并失败的文件手动编辑为我们希望的内容，再提交。

用`git log --graph`命令可以看到分支合并图。

## stash

Git还提供了一个stash功能，可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作。

执行`git stash`会储存当前工作现场，`git stash pop`会还原回到工作现场。

在master分支上修复的bug，想要合并到当前dev分支，可以用`git cherry-pick [commit_id]`命令，把bug提交的修改“复制”到当前分支，避免重复劳动。

## 多人协作

在本地创建和远程分支对应的分支，使用`git checkout -b [branch-name] origin/[branch-name]`，本地和远程分支的名称最好一致；

多人协作的工作模式通常是这样：

1. 首先，可以试图用`git push origin [branch-name]`推送自己的修改；

2. 如果推送失败，则因为远程分支比你的本地更新，需要先用`git pull`试图合并；

3. 如果合并有冲突，则解决冲突，并在本地提交；

4. 没有冲突或者解决掉冲突后，再用`git push origin [branch-name]`推送就能成功！

5. 如果`git pull`提示no tracking information，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to [branch-name] origin/[branch-name]`。

## 标签

Git的标签虽然是版本库的快照，但其实它就是指向某个commit的指针。tag就是一个让人容易记住的有意义的名字，它跟某个commit绑在一起。

### 添加推送删除标签

- git tag [tagname]：当前HEAD打标签
- git tag [tagname] [commit_id]：根据提交的commit_id打标签
- git tag：查看所有标签
- git show [tagname]：看标签信息
- git push origin [tagname]：可以推送一个本地标签
- git push origin --tags：可以推送全部未推送过的本地标签
- git tag -d [tagname]：删除本地标签
- git push origin :refs/tags/[tagname]：删除远程标签

## 常用命令

- git init：初始化创建git版本库
- git add [filename]：将文件添加到暂存区
- git commit -m 'xxx'：把暂存区的所有内容提交到当前分支
- git status：查看当前仓库的状态，告诉你有文件被修改过
- git diff [filename]：查看当前文件做了哪些改动
- git log：查看版本库历史操作记录，可以查看提交历史，以便确定要回退到哪个版本
- git reflog：可以查看每一次的命令，要重返未来，可以查看命令历史，以便确定要回到未来的哪个版本
- git reset --hard [commit_id]：可以进行版本的穿梭

  这里说明一下，Git在内部有个指向当前版本的HEAD指针，当你回退版本的时候，Git仅仅是改变HEAD指针。用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100。所以也可以这样进行回退到上个版本或从前任意版本：`git reset --hard HEAD^`

- git branch：查看分支
- git branch [name]：创建分支
- git checkout [name]或者git switch [name]：切换分支
- git checkout -b [name]或者git switch -c [name]：创建+切换分支
- git merge [name]：合并某分支到当前分支
- git branch -d [name]：删除分支
- git cherry-pick [commit_id]: 把提交的内容“复制”到当前分支
- git stash：储存当前工作现场
- git stash pop：还原回到工作现场
- git rebase：可以把本地未push的分叉提交历史整理成直线，rebase的目的是使得我们在查看历史提交的变化时更容易，因为分叉的提交需要三方对比
- git tag [tagname]：当前HEAD打标签
- git tag [tagname] [commit_id]：根据提交的commit_id打标签
- git tag：查看所有标签
- git show [tagname]：看标签信息
- git push origin [tagname]：可以推送一个本地标签
- git push origin --tags：可以推送全部未推送过的本地标签
- git tag -d [tagname]：删除本地标签
- git push origin :refs/tags/[tagname]：删除远程标签

参考链接：

- [Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)